import React from 'react';
import StoryBlock from './StoryBlock';

export default class extends React.Component {
    render() {
        return <div className="comments">
            {this.props.data.map((d) =>
                <StoryBlock key={d.storyId} story={d}/>
            )}
        </div>;
    }
}
