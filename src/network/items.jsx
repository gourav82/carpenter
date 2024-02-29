import { config } from "../config"


export const _getItemsById = async (id) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        };
        const response = await axios.patch(
            `${config.baseUrl}/item/get-items/${id}`, { headers: headers }
        );

        return response.data

    } catch (error) {
        console.log(error);
    }
}