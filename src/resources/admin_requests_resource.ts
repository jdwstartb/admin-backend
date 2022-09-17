import type {Drash} from "../deps.ts";
import BaseResource from "./base_resource.ts";
import UserModel from "../models/user_model.ts";
import {AdminRequestEntity, AdminRequestModel} from "../models/admin_requests_model.ts";

class AdminRequestResource extends BaseResource {
    paths = [
        "/adminRequests",
        "/adminRequests/:id",
        "/adminRequests/:id/review",
    ];

    public async GET(request: Drash.Request, response: Drash.Response) {
        console.log("Handling ArticlesResource GET.");

        if (request.pathParam("id")) {
            return await this.getAdminRequest(request, response);
        }

        return await this.getAdminRequests(request, response);
    }

    public async POST(request: Drash.Request, response: Drash.Response) {
        console.log("Handling ArticlesResource POST.");

        if (request.url.includes("/review")) {
            return await this.createReviewStatus(request, response);
        }

        return await this.createAdminRequest(request, response);
    }

    protected async createAdminRequest(
        request: Drash.Request,
        response: Drash.Response,
    ) {
        const probablyUser = (await this.getUser({session: true}, request))
        if (!probablyUser) {
            return this.errorResponse(
                403,
                "Needs to be logged in to create a request",
                response,
            );
        }
        const userID = probablyUser.id

        const inputRequest: AdminRequestEntity =
            (request.bodyParam("request") as AdminRequestEntity);

        if (!inputRequest.http_method) {
            return this.errorResponse(
                400,
                "Needs to set request http_method",
                response,
            );
        }

        if (!inputRequest.endpoint_url) {
            return this.errorResponse(
                400,
                "Needs to set request endpoint_url",
                response,
            );
        }

        if (!inputRequest.request_content && inputRequest.http_method != "GET") {
            return this.errorResponse(
                400,
                "Needs to set request_content for methods other than GET",
                response,
            );
        }

        const adminRequest = new AdminRequestModel();
        adminRequest.request_content = inputRequest.request_content;
        adminRequest.http_method = inputRequest.http_method;
        adminRequest.endpoint_url = inputRequest.endpoint_url;
        adminRequest.requested_by_user_id = userID;
        adminRequest.status = "new";
        await adminRequest.save();

        return response.json({
            adminRequest,
        });
    }

    protected async createReviewStatus(request: Drash.Request, response: Drash.Response) {
        return response.json({"status": "ok"})
    }


    protected async getAdminRequest(request: Drash.Request, response: Drash.Response) {
        const probablyUser = (await this.getUser({session: true}, request))
        if (!probablyUser) {
            return this.errorResponse(
                403,
                "Needs to be logged in to create a request",
                response,
            );
        }

        const id = request.pathParam("id") || "";
        const adminRequest = await AdminRequestModel.where(
            "id",
            id,
        ).first();

        if (!adminRequest) {
            return this.errorResponse(
                404,
                "Admin not found.",
                response,
            );
        }

        const user = await UserModel.where(
            "id",
            adminRequest.requested_by_user_id,
        ).first();
        if (!user) {
            return this.errorResponse(
                400,
                "Unable to determine the requester.",
                response,
            );
        }

        return response.json({
            adminRequest: {
                ...adminRequest,
                requestedBy: user.email,
            },
        });
    }

    /**
     * @description
     *     Get all articles--filtered or unfiltered.
     *
     *     Filters include:
     *         {
     *           author: string;       (author username)
     *           favorited_by: string; (author username)
     *           offset: number;       (used for filtering articles by OFFSET)
     *           tag: string;          (used for filtering articles by tag)
     *         }
     */
    protected async getAdminRequests(
        request: Drash.Request,
        response: Drash.Response,
    ) {


        const requestedById = request.queryParam("requestedBy");
        const reviewedById = request.queryParam("reviewedBy");
        const statusParam = request.queryParam("status");
        console.log(reviewedById)
        console.log(requestedById)
        console.log(statusParam)
        return response.json({
            statusParam,
            requestedById,
            reviewedById,
        });
    }
}

export default AdminRequestResource;
