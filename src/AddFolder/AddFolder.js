import React from 'react';
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'


class AddFolder extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: []
  };
  }
    
      static contextType = ApiContext
  
      
    
    handleSubmit(event) {
        event.preventDefault();
        const name = event.target.name.value;
        console.log('Name:',name)
        const folder = {
            name: event.target.name.value
        }
        
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(folder),
          })
            .then(res => {
              if (!res.ok)
              return res.json().then(e => Promise.reject(e))
              return res.json()
            })
            .then(folder => {
              this.context.addFolder(folder)
              this.props.history.push(`/folder/${folder.id}`)
              
            })
            .catch(error => {
              console.error({ error })
            })
    }
    render(){
        return(
            <section className="AddFolder">
                <h2>Create a folder</h2>
                <NotefulForm onSubmit={e=>this.handleSubmit(e)}>
                    <label htmlFor="folder-name-input">Name</label>
                   
                    <input type="text" id="folder-name-input" name="name"></input>
                    
                    <div className="buttons" >
                        <button 
                        type="submit">
                            Add folder
                        </button>
                    </div>
                </NotefulForm>

            </section>
        )
    }
}

export default AddFolder;