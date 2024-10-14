
export const apiUrl = () => process.env["NEXT_PUBLIC_API_URL"];
export const serverDomainUrl = () => process.env["NEXT_PUBLIC_SERVER_DOMAIN_URL"];
export const mainSocketUrl = () => process.env["NEXT_PUBLIC_MAIN_SOCKET_URL"] || "";
export const districtVotesUpdateEventName = () => process.env["NEXT_PUBLIC_DISTRICT_VOTES_UPDATE_EVENT_NAME"] || "";