import { MenuItem, TextField } from "@mui/material";
import { useField } from "formik";
import { selectValues } from "src/pages/CreatePostFormSimple";

const CustomInput = ({ ...props }) => {
    const [field, meta] = useField(props)
    return (
        <TextField
            helperText={(meta.error && meta.touched) ? <span className="errorInput"> {meta.error} </span> : ''}
            color={meta.error && meta.touched ? 'danger' : (!meta.error && meta.touched) ? 'success' : 'foggy'}
            margin="normal" focused {...field} {...props} />
    );
};

export const CustomSelect = ({ ...props }) => {
    const [field, meta] = useField(props);
    return (
        <TextField
            helperText={meta.error && meta.touched ? <span className="errorInput"> {meta.error} </span> : ''}
            color={meta.error && meta.touched ? 'danger' : (!meta.error && meta.touched) ? 'success' : 'foggy'}
            margin="normal" focused {...field} {...props} >
            <MenuItem disabled value='null'> Please Select a Category </MenuItem>
            {selectValues.map((option) => {
                return (
                    <MenuItem key={option} value={option}> {option} </MenuItem>
                )
            })}
        </TextField>
    );
};

export default CustomInput;