import http from "../http-common"

class DataService {
    CreateTable(data) {
        return http.post("/api/for/creating/table", data)
    }

    UpdateTable(id, data) {
        return http.put("/api/for/updating/table/" + id, data)
    }

    GetTables() {
        return http.get("/api/for/tables")
    }
}

export default new DataService()