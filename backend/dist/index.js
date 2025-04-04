"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = __importDefault(require("./db"));
const body_parser_1 = __importDefault(require("body-parser"));
const alertRoutes_1 = __importDefault(require("./routes/alertRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const entityRoutes_1 = __importDefault(require("./routes/entityRoutes"));
const chartentityRoutes_1 = __importDefault(require("./routes/chartentityRoutes"));
const weatherRoutes_1 = __importDefault(require("./routes/weatherRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/alerts", alertRoutes_1.default);
app.use("/api/entities", entityRoutes_1.default);
app.use("/api/settings", chartentityRoutes_1.default);
app.use("/api/weather", weatherRoutes_1.default);
app.use(body_parser_1.default.json());
const PORT = process.env.PORT || 3000;
// Database verbinden en server starten
db_1.default.sync();
console.log("Verbonden met de MySQL database!");
app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
;
