// import locationApi from "./locationCustom-axios.service";
import axios from "./axios.service";
export const GetProvince = async () => {
    try {
        const res = await axios.get('/address/province')
        return res.data.results
    } catch (error) {
        console.log(error);
    }
}

export const GetDistrict = async (province_id: string) => {
    try {
        const res = await axios.get(`/address/district/${province_id}`)
        return res.data.results
    } catch (error) {
        console.log(error);
    }
}


export const GetWard = async (district_id: string) => {
    try {
        const res = await axios.get(`/address/ward/${district_id}`)
        return res.data.results
    } catch (error) {
        console.log(error);
    }
}