package mocphim.com.backend_web.exception;

public class OPhimApiException extends RuntimeException {

    private final int statusCode;

    public OPhimApiException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
