import Slider from "@mui/material/Slider";
import {Select, MenuItem} from "@mui/material";

export default function SettingsPopup({preferences, setPreferences}) {
    function handleChange(event,key) {
        setPreferences({...preferences, [key]: event.target.value})
    }

    return (<div className={"settings-nav-panel"}>
            <span className={"header"}>Settings</span>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Page Padding</span>
                <Slider
                    size="large"
                    value={preferences.pagePadding}
                    max={30} min={1}
                    aria-label="Large"
                    valueLabelDisplay="auto"
                    onChange={(event) => {handleChange(event,"pagePadding")}}
                />
            </div>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Font Size</span>
                <Slider
                    size="large"
                    value={preferences.fontSize}
                    max={30} min={10}
                    aria-label="Large"
                    valueLabelDisplay="auto"
                    onChange={(event) => {handleChange(event,"fontSize")}}
                />
            </div>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Font Family</span>
                <Select
                    labelId="settings-font-family-label"
                    id="settings-font-family"
                    value={preferences.fontFamily}
                    style={{
                        fontFamily: preferences.fontFamily,
                    }}
                    label="Font Family"
                    onChange={(event) => {handleChange(event,"fontFamily")}}
                    fullWidth
                    variant="outlined"
                    MenuProps={{ anchorOrigin: { vertical: "top", horizontal: "center",}, transformOrigin: {  vertical: "bottom", horizontal: "center", }}}
                >
                    <MenuItem style={{fontFamily: "EB Garamond"}} value={"EB Garamond"}>EB Garamond</MenuItem>
                    <MenuItem style={{fontFamily: "Calibri"}} value={"Calibri"}>Calibri</MenuItem>
                    <MenuItem style={{fontFamily: "Arial"}} value={"Arial"}>Arial</MenuItem>
                </Select>
            </div>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Align Text</span>
                <Select
                    labelId="settings-align-text-label"
                    id="settings-align-text"
                    value={preferences.alignText}
                    label="Align Text"
                    onChange={(event) => {handleChange(event,"alignText")}}
                    fullWidth
                    variant="outlined"
                    MenuProps={{ anchorOrigin: { vertical: "top", horizontal: "center",}, transformOrigin: {  vertical: "bottom", horizontal: "center", }}}
                >
                    <MenuItem value={"Left"}>Left</MenuItem>
                    <MenuItem value={"Justify"}>Justify</MenuItem>
                    <MenuItem value={"Center"}>Center</MenuItem>
                    <MenuItem value={"Right"}>Right</MenuItem>
                </Select>
            </div>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Line Height</span>
                <Select
                    labelId="settings-line-height-label"
                    id="settings-line-height"
                    value={preferences.lineHeight}
                    label="Line Height"
                    onChange={(event) => {handleChange(event,"lineHeight")}}
                    fullWidth
                    variant="outlined"
                    MenuProps={{ anchorOrigin: { vertical: "top", horizontal: "center",}, transformOrigin: {  vertical: "bottom", horizontal: "center", }}}
                >
                    <MenuItem value={"1"}>1</MenuItem>
                    <MenuItem value={"1.15"}>1.15</MenuItem>
                    <MenuItem value={"1.5"}>1.5</MenuItem>
                    <MenuItem value={"2"}>2</MenuItem>
                </Select>
            </div>
        </div>)
}