export function processError(err: any) {
    if (err.response?.data?.message) {
        return 'Error: ' + err.response.data.message
    }
    if (err.message) {
        return err.message
    }
    return err.toString()
}
