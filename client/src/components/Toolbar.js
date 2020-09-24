import React, { useState } from 'react';
import { useSpring, useSprings, animated } from 'react-spring'
import classNames from 'classnames';
import * as easings from 'd3-ease'

import SearchTool from './SearchTool';
import CreatePost from './CreatePost';
import '../css/Toolbar.css';

function Toolbar({ postState, setPostState, feedState, setFeedState, defaultFeedData }) {
  // Classes
  const classes = classNames('Toolbar test-bg-2');
  const searchWidgetClasses = classNames('tool-widget');
  const createPostWidgetClasses = classNames('tool-widget');
  const AnimatedSearchTool = animated(SearchTool);
  const AnimatedCreatePost = animated(CreatePost);

  const [searchWidgetIsOpen, toggleSearchWidget] = useState(true);
  const searchWidgetProps = useSpring({
    config: {
      duration: 100
    },
    width: searchWidgetIsOpen ? 30 : 25,
    height: searchWidgetIsOpen ? 30 : 25
  });
  const searchWidgetPathProps = {
    fill: searchWidgetIsOpen ? "#FE774C" : "black"
  }

  const [postWidgetIsOpen, togglePostWidget] = useState(false);
  const postWidgetProps = useSpring({
    config: {
      duration: 100
    },
    width: postWidgetIsOpen ? 30 : 20,
    height: postWidgetIsOpen ? 30 : 20
  });
  const createPostWidgetPathProps = {
    fill: postWidgetIsOpen ? "#FE774C" : "black"
  }

  const [toolProps, setToolProps] = useSprings(2, index => ({
    config: {
      duration: 220,
      easing: easings.easePoly.exponent(3)
    },
    to: [{
      z: -100
    },
    {
      left: 0
    },
    {
      z: 0
    }]
  }));

  const switchTool = (index) => {
    setToolProps({
      to: [{
        z: -100
      }, {
        left: (index * -100)
      },
      {
        z: 0
      }]
    });
  }

  return (
    <div className={classes}>
      <div className="tool-widgets">
        <animated.svg
          className={searchWidgetClasses}
          viewBox="0 0 35 35"
          xmlns="http://www.w3.org/2000/svg"
          style={searchWidgetProps}
          onClick={() => {
            if (!searchWidgetIsOpen) {
             togglePostWidget(false);
             toggleSearchWidget(true);
             switchTool(0);
           }
          }}>
          <path fillRule="evenodd" style={searchWidgetPathProps} clipRule="evenodd" d="M23.0787 24.8868C20.2958 27.2044 16.7265 28.3599 13.1134 28.113C9.50023 27.8661 6.12137 26.2357 3.67964 23.5611C1.2379 20.8864 -0.0787197 17.3734 0.0036438 13.7528C0.0860073 10.1322 1.56102 6.68268 4.12185 4.12185C6.68268 1.56102 10.1322 0.0860073 13.7528 0.0036438C17.3734 -0.0787197 20.8864 1.2379 23.5611 3.67964C26.2357 6.12137 27.8661 9.50023 28.113 13.1134C28.3599 16.7265 27.2044 20.2958 24.8868 23.0787L34.5928 32.7847C34.7185 32.9018 34.8193 33.043 34.8892 33.2C34.9592 33.3569 34.9968 33.5263 34.9998 33.6981C35.0028 33.8699 34.9712 34.0405 34.9069 34.1998C34.8425 34.3591 34.7468 34.5038 34.6253 34.6253C34.5038 34.7468 34.3591 34.8425 34.1998 34.9069C34.0405 34.9712 33.8699 35.0028 33.6981 34.9998C33.5263 34.9968 33.3569 34.9592 33.2 34.8892C33.043 34.8193 32.9018 34.7185 32.7847 34.5928L23.0787 24.8868V24.8868ZM2.55786 14.072C2.55825 12.2013 3.01445 10.3588 3.88699 8.70403C4.75954 7.04925 6.02214 5.63198 7.56555 4.57486C9.10897 3.51774 10.8867 2.8526 12.745 2.63699C14.6033 2.42139 16.4861 2.66181 18.2305 3.33745C19.975 4.0131 21.5286 5.10362 22.7568 6.51466C23.9851 7.9257 24.851 9.61477 25.2797 11.4357C25.7085 13.2567 25.687 15.1546 25.2173 16.9654C24.7476 18.7763 23.8438 20.4453 22.584 21.8283C22.4109 21.8918 22.2537 21.992 22.1233 22.1222C21.9928 22.2524 21.8921 22.4094 21.8283 22.5823C20.1787 24.0858 18.1277 25.0774 15.9249 25.4366C13.722 25.7958 11.4622 25.5069 9.42052 24.6053C7.3788 23.7036 5.64315 22.228 4.42477 20.3579C3.20638 18.4878 2.55777 16.304 2.55786 14.072V14.072Z"/>
        </animated.svg>

        <animated.svg
          className={createPostWidgetClasses}
          viewBox="0 0 35 35"
          style={postWidgetProps}
          onClick={() => {
            if (!postWidgetIsOpen) {
              toggleSearchWidget(false);
              togglePostWidget(true);
              switchTool(1);
            }
          }}>
          <path fillRule="evenodd" style={createPostWidgetPathProps} clipRule="evenodd" d="M17.5 0C17.9801 0 18.4406 0.190732 18.7801 0.530237C19.1196 0.869743 19.3103 1.33021 19.3103 1.81034V15.6897H33.1897C33.6698 15.6897 34.1303 15.8804 34.4698 16.2199C34.8093 16.5594 35 17.0199 35 17.5C35 17.9801 34.8093 18.4406 34.4698 18.7801C34.1303 19.1196 33.6698 19.3103 33.1897 19.3103H19.3103V33.1897C19.3103 33.6698 19.1196 34.1303 18.7801 34.4698C18.4406 34.8093 17.9801 35 17.5 35C17.0199 35 16.5594 34.8093 16.2199 34.4698C15.8804 34.1303 15.6897 33.6698 15.6897 33.1897V19.3103H1.81034C1.33021 19.3103 0.869743 19.1196 0.530237 18.7801C0.190732 18.4406 0 17.9801 0 17.5C0 17.0199 0.190732 16.5594 0.530237 16.2199C0.869743 15.8804 1.33021 15.6897 1.81034 15.6897H15.6897V1.81034C15.6897 1.33021 15.8804 0.869743 16.2199 0.530237C16.5594 0.190732 17.0199 0 17.5 0Z"/>
        </animated.svg>

      </div>

      <div
        className="actual-tools">
        <AnimatedSearchTool {...toolProps[0]} feedState={feedState} setFeedState={setFeedState} defaultFeedData={defaultFeedData} />
        <AnimatedCreatePost {...toolProps[1]} postState={postState} setPostState={setPostState} />
      </div>
    </div>
  );
}

export default Toolbar;
