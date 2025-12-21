import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { IStatisticResponse } from "../types/IStatistic";

export const getStatisticOverTime = async () => {
	const response = await axiosConfiguration.get("/statistics/statistic-over-time", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
    return response.data as BaseResponse<IStatisticResponse>;
};
