import Slider from "@mui/material/Slider";
import {Select, MenuItem, TextField} from "@mui/material";

export default function SettingsPopup({preferenceOptions, preferences, setPreferences}) {
    function handleChange(event,key) {
        setPreferences({...preferences, [key]: event.target.value})
    }

    return (<div className={"settings-nav-panel"}>
            <span className={"header"}>Settings</span>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Page Padding (%)</span>
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
                    max={preferenceOptions.fontSizeMax} min={preferenceOptions.fontSizeMin}
                    aria-label="Large"
                    valueLabelDisplay="auto"
                    onChange={(event) => {handleChange(event,"fontSize")}}
                />
            </div>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Font Family</span>
                <TextField
                    select
                    id="settings-font-family"
                    value={preferences.fontFamily}
                    style={{
                        fontFamily: preferences.fontFamily,
                    }}
                    label="Font Family"
                    onChange={(event) => {handleChange(event,"fontFamily")}}
                    fullWidth
                    variant="outlined"
                >
                    {preferenceOptions.fontFamily.map(x => <MenuItem style={{fontFamily: x}} value={x}>{x}</MenuItem>)}
                </TextField>
            </div>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Align Text</span>
                <TextField
                    select
                    id="settings-align-text"
                    value={preferences.alignText}
                    label="Align Text"
                    onChange={(event) => {handleChange(event,"alignText")}}
                    fullWidth
                    variant="outlined"
                >
                    {preferenceOptions.alignText.map(x => <MenuItem value={x}>{x}</MenuItem>)}
                </TextField>
            </div>
            <div className={"settings-nav-setting"}>
                <span className={"settings-nav-setting-name"}>Line Height</span>
                <TextField
                    select
                    id="settings-line-height"
                    value={preferences.lineHeight}
                    label="Line Height"
                    onChange={(event) => {handleChange(event,"lineHeight")}}
                    fullWidth
                    variant="outlined"
                >
                    {preferenceOptions.lineHeight.map(x => <MenuItem value={x}>{x}</MenuItem>)}=
                </TextField>
            </div>
        </div>)
}