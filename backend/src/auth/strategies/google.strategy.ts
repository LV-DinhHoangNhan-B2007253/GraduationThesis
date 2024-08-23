import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleOauthConfig from "../config/google-oauth-config";
import { ConfigType } from "@nestjs/config";
import { AuthService } from "../service/auth.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(@Inject(googleOauthConfig.KEY) private googleConfiguration: ConfigType<typeof googleOauthConfig>,
        // private AuthService: AuthService

    ) {
        // super({
        //     clientID: googleConfiguration.clientID,
        //     clientSecret: googleConfiguration.clientSecret,
        //     callbackURL: googleConfiguration.callbackURL,
        //     scope: ["email", "profile"]
        // })
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SEC,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ["email", "profile"]
        })
    }


    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {


        const { name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            name: name.givenName,
            avatarUrl: photos[0].value,
            password: ''
        }

        done(null, user);
    }
}