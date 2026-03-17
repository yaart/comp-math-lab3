package yaart.s468198.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yaart.s468198.model.request.IntegrationRequest;
import yaart.s468198.model.response.IntegrationResponse;
import yaart.s468198.service.IntegrationService;
import yaart.s468198.service.FunctionProvider; // Импорт провайдера
import yaart.s468198.util.MathUtils; // Импорт утилит

@Slf4j
@RestController
@RequestMapping("/api/lab3")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class IntegrationController {

    private final IntegrationService integrationService;
    private final FunctionProvider functionProvider;

    @PostMapping("/calculate")
    public ResponseEntity<IntegrationResponse> solve(@RequestBody IntegrationRequest request) {
        log.info("Запрос на интеграцию...");

        if (request.getA() >= request.getB()) {
            return ResponseEntity.badRequest().body(
                    IntegrationResponse.builder().status("error").message("a должно быть < b").build()
            );
        }

        IntegrationResponse response = integrationService.calculate(request);

        if ("success".equals(response.getStatus())) {
            var f = functionProvider.getFunction(request.getFunctionId());
            response.setGraphPoints(MathUtils.generateGraphPoints(f, request.getA(), request.getB(), 100));
        }

        return ResponseEntity.ok(response);
    }
}