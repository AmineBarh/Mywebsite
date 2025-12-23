import { memo } from 'react';

const FilmGrain = memo(() => {
    return (
        <div
            className="film-grain"
            aria-hidden="true"
        />
    );
});

FilmGrain.displayName = 'FilmGrain';

export default FilmGrain;
