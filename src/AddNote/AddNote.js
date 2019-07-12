import React from 'react';
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationError'


class AddNote extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: '',
            touched: false
          },
          content: {
              value: '',
              touched: false
          },
          folder: {
            value: '',
            touched: false
        },
          
        }
      }

      updateNoteName(noteName) {
          this.setState({
              name: {value:noteName, touched: true}
          });
      }

      updateContent(noteContent) {
          this.setState({
              content: {value: noteContent, touched: true}
          })
      }
      

      static contextType = ApiContext

      

      
      
    
    handleSubmit(event) {
        event.preventDefault();
        console.log('Name: ', this.state.name.value);
        const noteName = event.target["note-name"].value
        const noteContent = event.target["note-content"].value
        const noteFolder = event.target["note-folder-id"].value
        const newNote = {
            name: noteName,
            content: noteContent,
            folderId: noteFolder,
            modified: new Date(),
        }
        console.log('NoteName:', noteName)
        console.log('NoteContent:', noteContent)
        console.log('NoteFolder:', noteFolder)

        
        
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(newNote),
          })
            .then(res => {
              if (!res.ok)
              return res.json().then(e => Promise.reject(e))
              return res.json()
            })
            .then(note => {
              this.context.addNote(note)
              this.props.history.push(`/folder/${note.folderId}`)
              
            })
            .catch(error => {
              console.error({ error })
            })
    }

    validateNoteName(name) {
        const noteName = this.state.name.value.trim()
        if(noteName.length===0) {
            return 'Name is required';
        }
    }

    validateNoteContent(content){
        const noteContent = this.state.content.value.trim()
        if(noteContent.length===0){
            return 'Content is required';
        }
    }

    


    
    render(){
        const nameError = this.validateNoteName();
        const contentError = this.validateNoteContent();
        
        const {folders=[]} = this.context
        return(
            <section className="AddNote">
                <h2>Create a Note</h2>
                <NotefulForm onSubmit={e=>this.handleSubmit(e)}>
                    <label htmlFor="note-name-input">Name</label>
                    <input type="text" id="note-name-input" name="note-name" onChange={e => this.updateNoteName(e.target.value)} ></input>
                    {this.state.name.touched && (
                    <ValidationError message={nameError} />
                    )}

                    <label htmlFor="note-content-input">Content</label>
                    <input type="text" id="note-content-input" name="note-content" onChange={e=>this.updateContent(e.target.value)}></input>
                    {this.state.content.touched && (
                    <ValidationError message={contentError} />
                    )}

                    <label htmlFor='note-folder-select'>
                        Folder
                    </label>
                    <select id='note-folder-select' name='note-folder-id'>
                    <option value={null} onChange={e=>this.updateFolder(e.target.value)}>...</option>
                    {folders.map(folder =>
                        <option key={folder.id} value={folder.id}>
                        {folder.name}
                        </option>
                    )}
                    </select>
                    
                    <div className="buttons" >
                        <button 
                        type="submit"
                        disabled={
                            this.validateNoteName() ||
                            this.validateNoteContent()
                            
                        }>
                            Add note
                        </button>
                    </div>
                </NotefulForm>

            </section>
        )
    }
}


export default AddNote;