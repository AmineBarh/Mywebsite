import { memo } from 'react';

const Aurora = memo(() => {
    return (
        <div className="aurora" aria-hidden="true" />
    );
});

Aurora.displayName = 'Aurora';

export default Aurora;
