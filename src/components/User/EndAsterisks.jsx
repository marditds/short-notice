export const EndAsterisks = ({ componentName }) => {
    return (
        <div className={`${componentName}__end-asterisks`} aria-live='polite' role='status' >
            <span className='visually-hidden'>
                No more items to load.
            </span>
            <i className='bi bi-asterisk' aria-hidden='true'></i>
            <i className='bi bi-asterisk' aria-hidden='true'></i>
            <i className='bi bi-asterisk' aria-hidden='true'></i>
        </div>
    )
} 