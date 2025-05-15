package com.devzora.devzora.controller;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.web.bind.annotation.*;
import com.devzora.devzora.dto.CourseDTO;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

@PostMapping("/create-checkout-session")
public String createCheckoutSession(@RequestBody CourseDTO course) throws Exception {
    SessionCreateParams params = SessionCreateParams.builder()
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .setSuccessUrl("http://localhost:5173/payment-success?courseId=" + course.getCourseId())
        .setCancelUrl("http://localhost:5173/payment-cancelled")
        .addLineItem(
            SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("usd")
                        .setUnitAmount((long) (course.getPrice() * 100)) // cents
                        .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName(course.getTitle())
                                .build()
                        )
                        .build()
                )
                .build()
        )
        .build();

    Session session = Session.create(params);
    return session.getUrl();
}

}
