import * as fs from "fs";
import * as ts from "typescript";
import { ConfigUtils } from "./utils/config-utils";
import { transformReducerFiles } from "./transformers/reducer-transformer";
import { AstUtils } from "./utils/ast-utils";
import { GraphqlUtils } from "./graphql";
import { MetaUtils } from "./utils/meta-utils";
import { transformSelectorFiles } from "./transformers/selector-transformer";
import { resolve } from "path";
import { log } from "console";



type FileChanged = { path: string, event?: ts.FileWatcherEventKind }

let reducerFilesChanged: FileChanged[] = []
let graphqlOperationFilesChanged: FileChanged[] = []
let selectorFilesChanged: FileChanged[] = []
let initialFiles: string[] = []

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};



export async function watchMain() {
    const configPath = ts.findConfigFile(
    /*searchPath*/ "./",
        ts.sys.fileExists,
        "tsconfig.json"
    );
    if (configPath == null) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    console.log("Config Path : ", configPath);

    const tsConfig = ts.parseConfigFileTextToJson(configPath, fs.readFileSync(configPath, "utf-8")).config

    MetaUtils.setUpMeta()

    const [validConfig, message] = await ConfigUtils.isValidConfig(tsConfig)
    console.log(`validConfig ${validConfig} message ${message}`);
    if (!validConfig) {
        throw new Error(`You didn't provided valid typesafe-store config : ${message},please follow the documentation link : TODO `)
    }

    //populate config
    // setTypeSafeStoreConfig(tsConfig)

    // TypeScript can use several different program creation "strategies":
    //  * ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    //  * ts.createSemanticDiagnosticsBuilderProgram
    //  * ts.createAbstractBuilder
    // The first two produce "builder programs". These use an incremental strategy
    // to only re-check and emit files whose contents may have changed, or whose
    // dependencies may have changes which may impact change the result of prior
    // type-check and emit.
    // The last uses an ordinary program which does a full type check after every
    // change.
    // Between `createEmitAndSemanticDiagnosticsBuilderProgram` and
    // `createSemanticDiagnosticsBuilderProgram`, the only difference is emit.
    // For pure type-checking scenarios, or when another tool/process handles emit,
    // using `createSemanticDiagnosticsBuilderProgram` may be more desirable.
    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    // Note that there is another overload for `createWatchCompilerHost` that takes
    // a set of root files.
    const host = ts.createWatchCompilerHost(
        configPath,
        {},
        ts.sys,
        createProgram,
        undefined, // Don't provide custom reporting ,just go with the default
        reportWatchStatusChanged
    );

    // You can technically override any given hook on the host, though you probably
    // don't need to.
    // Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
    // doesn't use `this` at all.
    // const origCreateProgram = host.createProgram;
    // host.createProgram = (
    //     rootNames: ReadonlyArray<string> | undefined,
    //     options,
    //     host,
    //     oldProgram
    // ) => {
    //     console.log("** We're about to create the program! **");
    //     const p = origCreateProgram(rootNames, options, host, oldProgram);
    //     setProgram(p.getProgram())
    //     return p
    // };
    const origPostProgramCreate = host.afterProgramCreate;

    host.afterProgramCreate = program => {
        AstUtils.setProgram(program.getProgram())
        // console.log("** We finished making the program! **");
        origPostProgramCreate!(program);
    };


    const origWatchFile = host.watchFile
    host.watchFile = (path, cb) => {
        if (path.includes(ConfigUtils.getConfig().reducersPath)) {
            initialFiles.push(path)
        }
        return origWatchFile(path, (f, e) => {
            handleFileChange(resolve(f), e)
            cb(f, e)
        })
    }


    // `createWatchProgram` creates an initial program, watches files, and updates
    // the program over time.
    const wp = ts.createWatchProgram(host);
    // setWatchCompilerHost(wp)
    AstUtils.setProgram(wp.getProgram().getProgram())



}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
    console.error(
        "Error",
        diagnostic.code,
        ":",
        ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            formatHost.getNewLine()
        )
    );
}



/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
    // if (initialFiles.length > 0 && program) {
    //     transformFiles(initialFiles)
    //     initialFiles = []
    // }
    console.info(ts.formatDiagnostic(diagnostic, formatHost));
    // console.info("********** diag: ********** ", diagnostic)
    processFiles(diagnostic)

}
/**
 * https://github.com/microsoft/TypeScript/blob/349ae45a2c2a0cefd034491624f095e68ae5c757/src/compiler/diagnosticMessages.json
 * @param diagnostic 
 */
function processFiles(diagnostic: ts.Diagnostic) {
    const msg = diagnostic.messageText.toString()
    console.log("Diag : ", diagnostic);
    if (diagnostic.code !== 6032 &&
        diagnostic.category !== ts.DiagnosticCategory.Error
        && (msg.includes("Found 0 errors") || !msg.includes("error"))
    ) {
        console.log("All Success : ", reducerFilesChanged, graphqlOperationFilesChanged);
        if (reducerFilesChanged.length > 0) {
            transformReducerFiles(reducerFilesChanged.map(rf => rf.path))
            reducerFilesChanged = []
        }
        if (graphqlOperationFilesChanged.length > 0) {
            GraphqlUtils.processFiles(graphqlOperationFilesChanged.map(go => go.path))
            graphqlOperationFilesChanged = []
        }
        if (selectorFilesChanged.length > 0) {
            transformSelectorFiles(selectorFilesChanged.map(sf => sf.path))
            selectorFilesChanged = []
        }
    }
}

function isFileAlreadyExistInChangedList(file: string, array: FileChanged[]) {
    let result = false
    array.forEach(cf => {
        if (cf.path === file) {
            result = true
            return
        }
    })
    return result
}

function handleFileChange(f: string, e: ts.FileWatcherEventKind) {
    console.log(`handle FileChange : ${f} , event : ${e} `);
    if (ConfigUtils.isReducersSourceFile(f)) {
        if (e == ts.FileWatcherEventKind.Deleted) {
            //handle deleted files

        } else {
            if (!isFileAlreadyExistInChangedList(f, reducerFilesChanged)) {
                reducerFilesChanged.push({ path: f, event: e })
            }
        }
    } else if (ConfigUtils.isGraphqlOperationsSourceFile(f)) {
        if (e == ts.FileWatcherEventKind.Deleted) {
            //handle deleted files

        } else {
            if (!isFileAlreadyExistInChangedList(f, graphqlOperationFilesChanged)) {
                graphqlOperationFilesChanged.push({ path: f, event: e })
            }
        }
    } else if (ConfigUtils.isSelectorsSourceFile(f)) {
        if (e == ts.FileWatcherEventKind.Deleted) {
            //handle deleted files

        } else {
            if (!isFileAlreadyExistInChangedList(f, selectorFilesChanged)) {
                selectorFilesChanged.push({ path: f, event: e })
            }
        }
    }
}

watchMain().catch(error => {
    console.error(error)
    process.exit()
})

