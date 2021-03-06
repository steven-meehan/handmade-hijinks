import React, { useState, useEffect } from 'react';

import Card from '../../UI/Card';
import Navbar from './Navbar';

import useHttp from '../../../Hooks/useHttp';
import classes from './Header.module.css';

import data from '../../../Configs/ConfigFileLocations.json';

const configUrl = data.find(item=>item.configuration==='navigation').url;

const Header = (props) => {
    const headerClasses = `${props.headerClasses ? props.headerClasses : ''} ${classes.header}`;

    const [navigationLinks, setNavigationLinks] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [logoAltText, setLogoAltText] = useState([]);

    const { sendRequest: fetchConfigs } = useHttp();

    useEffect(() => {
        const transformData = data =>{
            const loadedNavigationLinks = [];
            const loadedSocialLinks = [];

            for (const item in data.navigation) {
                if(data.navigation[item].social && data.navigation[item].active){
                    loadedSocialLinks.push({ 
                        url: data.navigation[item].url,
                        id: data.navigation[item].url,
                        name: data.navigation[item].name,
                        title: data.navigation[item].title,
                        active: data.navigation[item].active,
                        order: data.navigation[item].order,
                        social: data.navigation[item].social,
                        icon: data.navigation[item].icon,
                        internalLink: data.navigation[item].internalLink,
                        childLinks: data.navigation[item].childLinks
                    });
                } else {
                    if(data.navigation[item].active){
                        loadedNavigationLinks.push({ 
                            url: data.navigation[item].url,
                            id: data.navigation[item].url.substring(1),
                            name: data.navigation[item].name,
                            title: data.navigation[item].title,
                            active: data.navigation[item].active,
                            order: data.navigation[item].order,
                            social: data.navigation[item].social,
                            icon: data.navigation[item].icon,
                            internalLink: data.navigation[item].internalLink,
                            childLinks: data.navigation[item].childLinks
                        });
                    }
                }
            }

            const sortedNavigationList = loadedNavigationLinks.sort((a, b) => {
                return a.order - b.order;
            });
            const sortedSocialList = loadedSocialLinks.sort((a, b) => {
                return a.order - b.order;
            });
           
            setNavigationLinks(sortedNavigationList);
            setSocialLinks(sortedSocialList.sort());
            setLogoAltText(data.logoAltText);
        }
    
        fetchConfigs(
            { url: configUrl },
            transformData
        );
    }, [fetchConfigs]);
    
    return (    
        <header>
            <Card
                cardClasses={`${headerClasses}`}
                cardColor={`light`} >
                <Navbar navlinks={navigationLinks} socialNavLinks={socialLinks} logoAltText={logoAltText}/>
            </Card>
        </header>
    );
};

export default Header;