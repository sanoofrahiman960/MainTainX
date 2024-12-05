export const getErrorMsg = response => {
    const originalErrorMessage = response.originalError.message;

    switch (response.problem) {
        case 'CONNECTION_ERROR':
            return {
                ok: false,
                kind: 'cannot-connect',
                temporary: true,
                originalErrorMessage,
                data: response?.data,
            };
        case 'NETWORK_ERROR':
            return {
                ok: false,
                kind: 'cannot-connect',
                temporary: true,
                originalErrorMessage,
                data: response?.data,
            };
        case 'TIMEOUT_ERROR':
            return {
                ok: false,
                kind: 'timeout',
                temporary: true,
                originalErrorMessage,
                data: response?.data,
            };
        case 'SERVER_ERROR':
            return {
                ok: false,
                kind: 'server',
                originalErrorMessage,
                data: response?.data,
            };
        case 'UNKNOWN_ERROR':
            return {
                ok: false,
                kind: 'unknown',
                temporary: true,
                originalErrorMessage,
                data: response?.data,
            };
        case 'CLIENT_ERROR':
            switch (response.status) {
                case 401:
                    return {
                        ok: false,
                        kind: 'unauthorized',
                        originalErrorMessage,
                        data: response?.data,
                    };
                case 403:
                    return {
                        ok: false,
                        kind: 'forbidden',
                        originalErrorMessage,
                        data: response?.data,
                    };
                case 404:
                    return {
                        ok: false,
                        kind: 'not-found',
                        originalErrorMessage,
                        data: response?.data,
                    };
                default:
                    return {
                        ok: false,
                        kind: 'rejected',
                        originalErrorMessage,
                        data: response?.data,
                    };
            }
        case 'CANCEL_ERROR':
            return { ok: false, kind: 'cancelled' };
    }
};
