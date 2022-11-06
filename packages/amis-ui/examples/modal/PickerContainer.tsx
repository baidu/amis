import React from 'react';
import {PickerContainer, Button} from 'amis-ui';

function ConfirmContent(props:any, ref:any) {
    React.useImperativeHandle(ref, () => ({
        submit() {
            console.log('trigger submit');
            return false;
        }
    }));
    return <p>233</p>
}
(ConfirmContent as any) = React.forwardRef(ConfirmContent);

export default function() {
    const body = React.createRef<any>();
    const beforeConfirm = React.useCallback(() => {
        return body.current?.submit();
    }, []);

    return <div className="wrapper">
        <PickerContainer beforeConfirm={beforeConfirm} bodyRender={() => (
            <ConfirmContent ref={body}  />
        )}>{({isOpened, onClick}) => (<Button active={isOpened} onClick={onClick}>Open</Button>)}</PickerContainer>
    </div>
}