import { ReportFilterValues } from "../ReportFilterForm";
import { MonthlyTrendInterface } from "./MontlyTrendInterface";
import api, { handleApiError } from "@/lib/api";


const fetchMonthlyTrend = async (
  filters: ReportFilterValues
): Promise<MonthlyTrendInterface[]> => {
  const { account, fromDate, toDate } = filters;

  try {
    const response = await api.get(
      `/reports/monthly?account=${encodeURIComponent(account ?? "")}&fromDate=${encodeURIComponent(fromDate ?? "")}&toDate=${encodeURIComponent(toDate ?? "")}`
    );
    return response.data.trends;
  } catch (err: unknown) {
    const friendlyMessage = handleApiError(err);
    throw new Error(friendlyMessage);
  }
};

export default fetchMonthlyTrend;
