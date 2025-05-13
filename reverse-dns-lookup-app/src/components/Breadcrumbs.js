import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
          className="breadcrumb-item"
        >
          <Link itemProp="item" to="/">
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const position = index + 2;
          
          return (
            <li
              key={routeTo}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className={`breadcrumb-item${isLast ? ' active' : ''}`}
            >
              {isLast ? (
                <span itemProp="name">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </span>
              ) : (
                <Link itemProp="item" to={routeTo}>
                  <span itemProp="name">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </span>
                </Link>
              )}
              <meta itemProp="position" content={position.toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 