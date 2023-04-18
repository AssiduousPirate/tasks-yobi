import http from "../http-common"

class DataService {
    CreateUrl(data) {
        return http.post("/api/for/inserting/url", data)
    }

    GetUrls() {
        return http.get("/api/for/retriving/urls")
    }
}

export default new DataService()