package net.micromart.email.dto;

public class EmailRequest {
    private String to;
    private String subject;
    private String body;
    private String template;
    private Object data;

    public EmailRequest() {}

    public EmailRequest(String to, String subject, String body) {
        this.to = to;
        this.subject = subject;
        this.body = body;
    }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}