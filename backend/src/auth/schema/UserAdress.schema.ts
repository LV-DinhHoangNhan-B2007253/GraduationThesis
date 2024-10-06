import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Định nghĩa lớp Ward
@Schema()
export class Ward {
    @Prop({ required: true })
    ward_id: string;

    @Prop({ required: true })
    ward_name: string;
}

// Định nghĩa lớp District
@Schema()
export class District {
    @Prop({ required: true })
    district_id: string;

    @Prop({ required: true })
    district_name: string;
}

// Định nghĩa lớp Province
@Schema()
export class Province {
    @Prop({ required: true })
    province_id: string;

    @Prop({ required: true })
    province_name: string;
}

// Định nghĩa lớp Address
@Schema()
export class Address {
    @Prop({ type: Province, required: true })
    province: Province;

    @Prop({ type: District, required: true })
    district: District;

    @Prop({ type: Ward, required: true })
    ward: Ward;

    @Prop({ required: true })
    detail: string; // Chi tiết địa chỉ
}

// Xuất các schema
export const WardSchema = SchemaFactory.createForClass(Ward);
export const DistrictSchema = SchemaFactory.createForClass(District);
export const ProvinceSchema = SchemaFactory.createForClass(Province);
export const AddressSchema = SchemaFactory.createForClass(Address);