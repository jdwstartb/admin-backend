import { Model, QueryBuilder } from "../deps.ts";

export type AdminRequestEntity = {
    requested_by_user_id: number;
    id: number;
    endpoint_url: string;
    http_method: string;
    request_content: object;
    status: string;
    reviewed_by_user_id: number;
};

export class AdminRequestModel extends Model {

    public requested_by_user_id = 0;

    public reviewed_by_user_id = 0;

    public status = "";

    public id = 0;


    public endpoint_url = "";

    public http_method = "";

    public request_content = {};

    public tablename = "requests";

    public factoryDefaults(params: Partial<AdminRequestEntity> = {}) {
        return {
            requested_by_user_id: params.requested_by_user_id ?? 0,
            reviewed_by_user_id: params.reviewed_by_user_id ?? 0,
            endpoint_url: params.endpoint_url?? "",
            http_method : params.http_method??"GET",
            request_content: params.request_content?? {},
            status: params.status ?? "new",
        };
    }
}

export default AdminRequestModel;