import React, {useState, useEffect} from 'react';
import { db } from '../firebase';
import '../../node_modules/bulma/css/bulma.css';

const LinkForm = (props) => {
    const initialStateValues = {
        url:'',
        websitename:'',
        description:''
    }
    const [values, setValues] = useState(initialStateValues);
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setValues({...values, [name]: value});
    }

    const validateUrl = (str) => {
        var pattern = new RegExp(
          "^(https?:\\/\\/)?" + 
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + 
          "((\\d{1,3}\\.){3}\\d{1,3}))" + 
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + 
          "(\\?[;&a-z\\d%_.~+=-]*)?" + 
            "(\\#[-a-z\\d_]*)?$",
          "i"
        ); 
        return pattern.test(str);
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!validateUrl(values.url)) {
            console.log('Invalid url')
        }
        props.addOrEditLink(values);
        setValues({...initialStateValues});
    }

    const getLinkById = async (id) => {
        const doc = await db.collection('links').doc(id).get();
        setValues({...doc.data()});
    }

    useEffect(() => {
        if(props.currentId === '') {
            setValues({...initialStateValues});
        } else {
            getLinkById(props.currentId);
        }
    }, [props.currentId]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="field">
                <label class="label">Url</label>
                <div class="control">
                    <input className="input" type="text" placeholder="https://sorayaleongonzalez.es" name="url" onChange= {handleInputChange} value={values.url}/>
                </div>
            </div>
            <div className="field">
                <label class="label">Website</label>
                <div class="control">
                    <input className="input" type="text" placeholder="Website name" name="websitename" onChange= {handleInputChange} value={values.websitename}/>
                </div>
            </div>
            <div className="field">
                <label class="label">Description</label>
                <div class="control">
                    <textarea class="textarea" name="description"rows="10" placeholder="Write a description" onChange= {handleInputChange} value={values.description}></textarea>
                </div>
            </div>
            <button class="button is-primary">
                {props.currentId === '' ? 'Save' : 'Update'}
            </button>
        </form>
    )
}

export default LinkForm;