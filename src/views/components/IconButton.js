import { IconButton } from '@material-ui/core'

const IconButtonAtoms = ({ handleClick, icon }) =>
    <IconButton
        color='secondary'
        onClick={handleClick} >
        {icon} 
    </IconButton>

export default IconButtonAtoms;
