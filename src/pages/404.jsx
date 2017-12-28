import React from 'react';

class NotFound extends React.Component {
  componentWillMount(){
     document.title="404"
  }
  render(){
    return (
      <div>
        <div className="error-page">
              <h1 data-h1="404">404</h1>
              <p data-p="NOT FOUND">NOT FOUND</p>
        </div>
        <style>
            {`
              .error-page{
                padding-top:250px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
              }
              .error-page h1{
                  font-size: 150px;
                  position:relative;
                  color: rgba(0, 0, 0, 0.85);
              }
               h1:after{
                content:"404";
                position:absolute;
                background: -webkit-repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176, #b98acc, #69a6ce, #9b59b6);
                background-size: 400%;
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent;
                animation:animateTextBackground 10s ease-in-out infinite;
                top: 0px;
                left: 0;
                right: 0;
              } 
              p{
                margin-top:60px;
                font-size:30px;
                color:#d6d6d6;
                text-shadow: 1px 1px 2px transparentize(#fff, .5);
                font-weight: bold
              }
              @keyframes animateTextBackground{
                          0%{ background-position: 0 0 ;}
                          25%{  background-position: 100% 0 ;}
                          50%{ background-position: 100% 100% ;}
                          75%{ background-position: 0 100%;}
                          100%{ background-position: 0 0;}
               }
            `}
        </style>
      </div>
    );
  }
};


export default NotFound;
