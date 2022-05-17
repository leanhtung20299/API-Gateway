package com.commerce.backend.listener;

import com.commerce.backend.constants.MailConstants;
import com.commerce.backend.model.event.OnRegistrationCompleteEvent;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;


@Component
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MailConstants mailConstants;

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        try {
			this.confirmRegistration(event);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
    }

    private void confirmRegistration(OnRegistrationCompleteEvent event) throws MessagingException {
        String recipientAddress = event.getUser().getEmail();
        String subject = "\uD83D\uDD11 Keyist Registration Confirmation";
        String confirmationUrl = mailConstants.getHostAddress() + "/registrationConfirm?token=" + event.getToken();
        String linkConfirm = "<h3><a href=\""+"https://vnexpress.net/"+"\">Verify</a></h3>";
        String message = "Hi ,\n\nPlease confirm your email with this link. ";

        MimeMessage messageEmail = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(messageEmail);
        helper.setTo(recipientAddress);
        helper.setSubject(subject);
        helper.setText(message + "\n\n" + linkConfirm + "\n\n\n Keyist Team",true);
        mailSender.send(messageEmail);
    }
}