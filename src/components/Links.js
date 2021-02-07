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

    return <div>
        <LinkForm {...{addOrEditLink, currentId, links}}/>
        <div>
            {links.map(link => (
                <div key={link.id}>
                    <div>
                        <h4>{link.websitename}</h4>
                        <p onClick={() => onDeleteLink(link.id)}>Close</p>
                        <p onClick={() => setCurrentId(link.id)}>Edit</p>
                    </div>
                    <p>{link.description}</p>
                    <a href={link.url} target='_blank' rel="noreferrer">Go to website</a>
                </div>
            ))}
        </div>
    </div>
}

export default Links;