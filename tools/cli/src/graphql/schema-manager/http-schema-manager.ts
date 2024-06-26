import { SchemaManager } from "./schema-manager"
import { HttpUrlConfig, ContentType } from "../../types"
import { GraphQLSchema, buildClientSchema } from "graphql"
import { introspectionQuery } from "graphql/utilities"
import fetch from "node-fetch"
const INTRO_SPECTION_QUERY = { query: introspectionQuery }


export class HttpSchemaManager extends SchemaManager {

    constructor(public http: HttpUrlConfig, public readonly tag: string) {
        super(tag, http.url)
    }

    private _schema?: GraphQLSchema
    private _error?: string

    // get schema() {
    //     return this._schema
    // }

    // get error() {
    //     return this._error
    // }

    async readSchema() {
        const options: RequestInit = { method: "POST", headers: { "Content-Type": ContentType.APPLICATION_JSON } }
        try {
            if (this.http.method) {
                options.method = this.http.method;
            }
            if (this.http.headers) {
                options.headers = { ...options.headers, ...this.http.headers }
            }

            options.body = JSON.stringify(INTRO_SPECTION_QUERY)

            const resp = await fetch(this.http.url, options as any)

            if (!resp.ok) {
                this._error = `Request to ${this.http.url} failed with error : ${resp.statusText}`
            } else {
                const json = await resp.json()
                this._schema = buildClientSchema(json.data)
            }

        } catch (error) {
            this._error = `Error while trying to get schema from url ${this.http.url} : ${error}`
        }
    }

}