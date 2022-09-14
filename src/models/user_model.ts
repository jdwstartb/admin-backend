import { Model, QueryBuilder } from "../deps.ts";
import SessionModel from "./session_model.ts";

export type UserEntity = {
    id: number;
    eoa: string;
    username: string;
    email: string;
    password: string;
};

export class UserModel extends Model {

    /**
     * @var string
     *
     * Email address for the given user
     */
    public email = "";

    /**
     * @var number
     *
     * Associated row id for the database entry
     */
    public id = 0;

    /**
     * @var string
     *
     * username
     */
    public username = "";

    /**
     * @var string
     *
     * EOA of the given user.
     */
    public eoa = "";

    public password = "";

    public tablename = "users";

    public factoryDefaults(params: Partial<UserEntity> = {}) {
        return {
            email: params.email ?? "test@hotmail.com",
            username: params.username ?? "drash",
            eoa: params.eoa ?? "",
            password: params.password?? "",
        };
    }

    public async session(): Promise<SessionModel | null> {
        return await SessionModel.where(
            "user_id",
            this.id,
        ).first();
    }
}

export default UserModel;