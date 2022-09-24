import { Input, MenuItem, Select, TextField } from "@mui/material";
import { selectValues } from "src/pages/CreatePostFormSimple";


const { useField } = require("formik");


const CustomInput = ({ ...props }) => {
    const [field, meta] = useField(props)
    return (
        <div>
            <TextField 
            // danger={meta.touched}
                helperText={meta.error && meta.touched ? <span className="errorInput"> {meta.error} </span> : ''}
                // color='foggy'
                color={meta.error && meta.touched ? 'danger' : !meta.error && meta.touched ? 'success' : 'foggy'}
                margin="normal" focused {...field} {...props} />
            {/* {meta.error && meta.touched && <h6 className="errorText smallFont" id="feedback" >*{meta.error}</h6>} */}
        </div>
    )
}

export const CustomSelect = ({ ...props }) => {
    // const selectValues = ['Electronics', 'Gadgets', 'Buildings', 'Apartments', 'Bikes', 'Cars', 'Laptop', 'Cycles', 'Desktop', 'Other']
    const selections = selectValues
    const [field, meta] = useField(props)
    return (
        <div>
            <TextField 
            // danger={meta.touched}
                helperText={meta.error && meta.touched ? <span className="errorInput"> {meta.error} </span> : ''}
                // color='foggy'
                color={meta.error && meta.touched ? 'danger' : !meta.error && meta.touched ? 'success' : 'foggy'}
                margin="normal" focused {...field} {...props} >
                <MenuItem disabled value='null'> Please Select a Category </MenuItem>
                {selections.map((option) => {
                    return (
                        <MenuItem key={option} value={option}> {option} </MenuItem>
                    )
                })}
            </TextField>

            {/* {meta.error && meta.touched && <h6 className="errorInput" id="feedback" >*{meta.error}</h6>} */}
        </div>
    )
}

export default CustomInput