import { Body, Controller, Get, Param, Post, Request, Res, UseGuards, UsePipes, ValidationPipe, } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { District } from "../schema/UserAdress.schema";



@Controller('api/address')
export class AddressController {

    @Get('/province')
    async GetProvince() {
        const res = await fetch('https://vapi.vnappmob.com/api/province')
        return res.json()
    }

    @Get('/district/:provinceId')
    async GetDistrict(@Param('provinceId') provinceId: string) {

        const res = await fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)

        return res.json()
    }

    @Get('/ward/:districtId')
    async GetWard(@Param('districtId') districtId: string) {

        const res = await fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)

        return res.json()
    }

}