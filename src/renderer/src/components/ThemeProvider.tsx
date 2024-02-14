import { createTheme } from "@mui/material";
import { Config } from "@renderer/store/config";

export const theme = createTheme({
    palette: {
        primary: {
            main: Config.getState().colors, // COLOR PRIMARIO DE LA APLICACION
        },
    }
})