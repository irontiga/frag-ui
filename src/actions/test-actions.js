// action
export const UPDATE_NAME = 'UPDATE_NAME'

// action creator
export const updateName = name => {
    return {
        type: UPDATE_NAME,
        name
    }
}
