import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from './IconButton'

const SelectedList = ({ list, handleItemClick, handleDeleteClick, index}) => (
     <List component="nav" aria-label="secondary">
          {
            list.map(item =>
              <ListItem
                button
                selected={index === item.id} key={item.id}>
                <ListItemText
                    primary={item.name}
                    onClick={() => {
                      console.log(item)
                      handleItemClick(item)
                    }
                } />
                <ListItemSecondaryAction
                  onClick={() => {
                    handleDeleteClick(list, item)
                  }
                }>
                  <IconButton icon={<DeleteIcon />}  />
                </ListItemSecondaryAction>
              </ListItem>
            )
          }
        </List>  
)

export default SelectedList;