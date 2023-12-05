import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../Stylings/breadcrumb.css";

const BreadcrumbTrails = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div>
      {pathnames.length > 0 && (
        <ul className='padding'>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <li key={name}>
                {isLast ? (
                  <span className={'crumbs'}>{name}</span>
                ) : (
                  <span> 
                    {name === "citypage" || name === "favorite-city" || name === "message-board" || name === "favorite-search" ? (
                        <span>
                            <span className={'crumbs'}>{name}</span>
                            <span className={'arrow'}>➤</span>
                        </span>
                    ) : (
                        <span>
                            <Link className="a" to={routeTo}>{name}</Link>
                            <span className={'arrow'}>➤</span>
                        </span>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BreadcrumbTrails;
