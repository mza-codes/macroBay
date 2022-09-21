import { Input, MenuItem, Select, TextField } from "@mui/material";


const { useField } = require("formik");


const CustomInput = ({ ...props }) => {
    // console.log(props);
    const [field, meta, helpers] = useField(props)
    // console.log('field', field);
    // console.log('meta', meta);
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
    const selectValues = ['Electronics', 'Gadgets', 'Buildings', 'Apartments', 'Bikes', 'Cars', 'Laptop', 'Cycles', 'Desktop', 'Other']
    console.log(props);
    const [field, meta, helpers] = useField(props)
    console.log('fieldSelect', field);
    console.log('metaSelect', meta);
    return (
        <div>
            <TextField 
            // danger={meta.touched}
                helperText={meta.error && meta.touched ? <span className="errorInput"> {meta.error} </span> : ''}
                // color='foggy'
                color={meta.error && meta.touched ? 'danger' : !meta.error && meta.touched ? 'success' : 'foggy'}
                margin="normal" focused {...field} {...props} >
                <MenuItem disabled value='null'> Please Select a Category </MenuItem>
                {selectValues.map((option) => {
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