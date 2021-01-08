import { List, ListItem, ListItemText } from '@material-ui/core'

const SelectedList = ({ list, handleClick, index}) => (
     <List component="nav" aria-label="secondary">
          {
            list.map(item =>
              <ListItem
                button
                selected={index === item.id} key={item.id}>
                <ListItemText
                    primary={item.name}
                    onClick={() => {
                        handleClick(item)
                    }
                } />
              </ListItem>
            )
          }
        </List>  
)

export default SelectedList;