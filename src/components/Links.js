import React, {useEffect, useState} from 'react';
import LinkForm from './LinkForm';
import {db} from '../firebase';

const Links = () => {
    const [links, setLinks] = useState([]);
    const [currentId, setCurrentId] = useState('');

    const addOrEditLink = async (linkObject) => {
        try {
            if(currentId === '') {
                await db.collection('links').doc().set(linkObject);
            } else {
                await db.collection('links').doc(currentId).update(linkObject);
                setCurrentId('');
            }
        } catch (error) {
            console.error(error);
        }
        
    }

    const onDeleteLink = async (id) => {
        if(window.confirm('Are you sure want to delete this link?')){
            await db.collection('links').doc(id).delete();
        }
    }

    const getLinks = async () => {
        db.collection('links').onSnapshot((querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({...doc.data(), id:doc.id});
            });
            setLinks(docs);
        });
    }

    useEffect(() => {
        getLinks();
    }, []);

    return <div className="container my-5">
        <div className="columns is-multiline">
            <div className="column is-6-tablet">
                <LinkForm {...{addOrEditLink, currentId, links}}/>
            </div>
            <div className="column is-6-tablet">
                {links.map(link => (
                    <div className="card mb-4" key={link.id}>
                        <div className="card-header">
                            <h4 className="card-header-title">{link.websitename}</h4>
                            <i className="material-icons card-header-icon" onClick={() => onDeleteLink(link.id)}>
                                close
                            </i>
                            <i className="material-icons card-header-icon" onClick={() => setCurrentId(link.id)}>
                                create
                            </i>
                        </div>
                        <div className="card-content">
                            <p>{link.description}</p>
                            <a href={link.url} target='_blank' rel="noreferrer">Go to website</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}

export default Links;