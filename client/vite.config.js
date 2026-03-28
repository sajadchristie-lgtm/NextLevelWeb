var _a;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: Number((_a = process.env.CLIENT_PORT) !== null && _a !== void 0 ? _a : 5173),
        proxy: {
            "/api": "http://localhost:4000",
            "/uploads": "http://localhost:4000"
        }
    }
});
