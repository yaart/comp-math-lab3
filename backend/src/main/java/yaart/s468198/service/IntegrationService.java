package yaart.s468198.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import yaart.s468198.model.request.IntegrationRequest;
import yaart.s468198.model.response.IntegrationResponse;
import yaart.s468198.service.methods.*;

import java.util.function.Function;

@Slf4j
@Service
@RequiredArgsConstructor
public class IntegrationService {

    private final FunctionProvider functionProvider;

    public IntegrationResponse calculate(IntegrationRequest request) {
        int functionId = request.getFunctionId();
        double a = request.getA();
        double b = request.getB();

        log.info("Вычисление интеграла: functionId={}, a={}, b={}, eps={}",
                functionId, a, b, request.getEpsilon());

        if (functionProvider.hasSingularity(functionId, a, b)) {
            return handleImproperIntegral(request);
        }

        return calculateProperIntegral(request);
    }

    private IntegrationResponse handleImproperIntegral(IntegrationRequest request) {
        int functionId = request.getFunctionId();
        double a = request.getA();
        double b = request.getB();
        double singularPoint = functionProvider.getSingularPoint(functionId);
        String singularityType = functionProvider.getSingularityType(functionId, a, b);

        log.info("Обнаружен несобственный интеграл: functionId={} на [{}, {}], {}",
                functionId, a, b, singularityType);

        boolean isConvergent = functionProvider.isConvergent(functionId, a, b);

        try {
            IntegrationMethod method = selectMethod(request.getMethodId());
            double eps = request.getEpsilon();

            double result;
            int n = 8;
            String message;
            String functionType;

            Double exactValue = functionProvider.calculateExactValue(request.getFunctionId(), a, b);

            if (!isConvergent) {
                log.info("Интеграл расходится для functionId={} на [{}, {}]", functionId, a, b);

                double approxValue = 0;
                try {
                    if (Math.abs(a - singularPoint) < 1e-10) {
                        approxValue = method.calculate(functionProvider.getFunction(functionId), a + 1e-6, b, 1000);
                    } else if (Math.abs(b - singularPoint) < 1e-10) {
                        approxValue = method.calculate(functionProvider.getFunction(functionId), a, b - 1e-6, 1000);
                    } else {
                        double left = method.calculate(functionProvider.getFunction(functionId), a, singularPoint - 1e-6, 500);
                        double right = method.calculate(functionProvider.getFunction(functionId), singularPoint + 1e-6, b, 500);
                        approxValue = left + right;
                    }
                } catch (Exception e) {
                    approxValue = Double.NaN;
                }

                return IntegrationResponse.builder()
                        .result(approxValue)
                        .n(1000)
                        .error(Double.NaN)
                        .exactValue(exactValue)
                        .isImproper(true)
                        .functionType("divergent")
                        .singularityType(singularityType)
                        .status("warning")
                        .message("Интеграл расходится (несобственный интеграл 2 рода)")
                        .build();
            }

            if (Math.abs(a - singularPoint) < 1e-10) {
                log.info("Разрыв на левой границе a={}", a);
                result = calculateWithSingularityAtLeft(functionId, a, b, eps, method);
                n = 16;
            }
            else if (Math.abs(b - singularPoint) < 1e-10) {
                log.info("Разрыв на правой границе b={}", b);
                result = calculateWithSingularityAtRight(functionId, a, b, eps, method);
                n = 16;
            }
            else {
                log.info("Разрыв внутри интервала в точке {}", singularPoint);
                result = calculateWithInteriorSingularity(
                        functionId, a, b, singularPoint, eps, method);
                n = 32;
            }

            return IntegrationResponse.builder()
                    .result(result)
                    .n(n)
                    .error(estimateError(result, exactValue))
                    .exactValue(exactValue)
                    .isImproper(true)
                    .functionType("convergent improper")
                    .singularityType(singularityType)
                    .status("success")
                    .message("Несобственный интеграл успешно вычислен")
                    .build();

        } catch (Exception e) {
            log.error("Ошибка при вычислении несобственного интеграла: {}", e.getMessage());
            return IntegrationResponse.builder()
                    .status("error")
                    .message("Ошибка при вычислении несобственного интеграла: " + e.getMessage())
                    .isImproper(true)
                    .singularityType(singularityType)
                    .build();
        }
    }

    private double calculateWithSingularityAtLeft(int functionId, double a, double b,
                                                  double eps, IntegrationMethod method) {
        Function<Double, Double> f = functionProvider.getFunction(functionId);

        if (functionId == 5 && Math.abs(a - 2.0) < 1e-10) {
            log.warn("Интеграл для функции 5 на [2, {}] расходится к +∞", b);
            return Double.POSITIVE_INFINITY;
        }

        double delta = 1e-4;
        double prevResult = 0;
        double currentResult = 0;
        int n = 8;
        int maxIterations = 10;

        for (int iter = 0; iter < maxIterations; iter++) {
            try {
                currentResult = method.calculate(f, a + delta, b, n);

                if (Double.isInfinite(currentResult) || Double.isNaN(currentResult)) {
                    log.warn("Получена бесконечность на итерации {}, интеграл расходится", iter);
                    return Double.POSITIVE_INFINITY;
                }

                if (functionId == 5 && Math.abs(currentResult) > 1e6) {
                    log.warn("Значение {} слишком большое, интеграл расходится", currentResult);
                    return Double.POSITIVE_INFINITY;
                }

                if (iter > 0) {
                    double diff = Math.abs(currentResult - prevResult);
                    log.debug("Итерация {}: delta={}, результат={}, diff={}",
                            iter, delta, currentResult, diff);

                    if (diff > Math.abs(prevResult) * 10 && iter > 2) {
                        log.warn("Разница растет, интеграл расходится");
                        return Double.POSITIVE_INFINITY;
                    }

                    if (diff < eps) {
                        break;
                    }
                }

                prevResult = currentResult;
                delta = Math.max(delta / 2, 1e-6);
                n *= 2;

            } catch (Exception e) {
                log.warn("Ошибка на итерации {}, интеграл расходится", iter);
                return Double.POSITIVE_INFINITY;
            }
        }

        return currentResult;
    }
    private double calculateWithSingularityAtRight(int functionId, double a, double b,
                                                   double eps, IntegrationMethod method) {
        Function<Double, Double> f = functionProvider.getFunction(functionId);

        if (functionId == 5 && Math.abs(b - 2.0) < 1e-10) {
            log.warn("Интеграл для функции 5 на [{}, 2] расходится к -∞", a);
            return Double.NEGATIVE_INFINITY;
        }

        double delta = 1e-4;
        double prevResult = 0;
        double currentResult = 0;
        int n = 8;
        int maxIterations = 10;

        for (int iter = 0; iter < maxIterations; iter++) {
            try {
                currentResult = method.calculate(f, a, b - delta, n);

                if (Double.isInfinite(currentResult) || Double.isNaN(currentResult)) {
                    log.warn("Получена бесконечность на итерации {}, интеграл расходится", iter);
                    return Double.NEGATIVE_INFINITY;
                }

                if (functionId == 5 && Math.abs(currentResult) > 1e6) {
                    log.warn("Значение {} слишком большое, интеграл расходится", currentResult);
                    return Double.NEGATIVE_INFINITY;
                }

                if (iter > 0) {
                    double diff = Math.abs(currentResult - prevResult);
                    log.debug("Итерация {}: delta={}, результат={}, diff={}",
                            iter, delta, currentResult, diff);

                    if (diff > Math.abs(prevResult) * 10 && iter > 2) {
                        log.warn("Разница растет, интеграл расходится");
                        return Double.NEGATIVE_INFINITY;
                    }

                    if (diff < eps) {
                        break;
                    }
                }

                prevResult = currentResult;
                delta = Math.max(delta / 2, 1e-6);
                n *= 2;

            } catch (Exception e) {
                log.warn("Ошибка на итерации {}, интеграл расходится", iter);
                return Double.NEGATIVE_INFINITY;
            }
        }
        return currentResult;
    }

    private double calculateWithInteriorSingularity(int functionId, double a, double b,
                                                    double singularPoint, double eps,
                                                    IntegrationMethod method) {
        if (functionId == 4) {
            double leftValue = 0;
            double rightValue = 0;

            if (a < 0) {
                leftValue = 2 * Math.sqrt(-a);
            }
            if (b > 0) {
                rightValue = 2 * Math.sqrt(b);
            }

            double exactTotal = leftValue + rightValue;
            log.info("Аналитическое значение для функции 4 на [{}, {}] = {} (левая: {}, правая: {})",
                    a, b, exactTotal, leftValue, rightValue);


            double leftPart = calculateWithSingularityAtRight(functionId, a, singularPoint, eps / 2, method);
            double rightPart = calculateWithSingularityAtLeft(functionId, singularPoint, b, eps / 2, method);
            double numericalTotal = leftPart + rightPart;

            log.info("Численное значение: левая часть={}, правая часть={}, сумма={}",
                    leftPart, rightPart, numericalTotal);

            return numericalTotal;
        }

        if (functionId == 5) {
            double delta = 1e-4;
            double prevResult = 0;
            double currentResult = 0;
            int n = 16;
            int maxIterations = 10;

            for (int iter = 0; iter < maxIterations; iter++) {
                double leftPart = method.calculate(
                        functionProvider.getFunction(functionId),
                        a, singularPoint - delta, n);
                double rightPart = method.calculate(
                        functionProvider.getFunction(functionId),
                        singularPoint + delta, b, n);
                currentResult = leftPart + rightPart;

                log.debug("Главное значение: delta={}, левая={}, правая={}, сумма={}",
                        delta, leftPart, rightPart, currentResult);

                if (iter > 0) {
                    double diff = Math.abs(currentResult - prevResult);
                    if (diff < eps) {
                        break;
                    }
                }

                prevResult = currentResult;
                delta = Math.max(delta / 2, 1e-6);
                n *= 2;
            }
            return currentResult;
        }

        double leftPart = calculateWithSingularityAtRight(
                functionId, a, singularPoint, eps / 2, method);
        double rightPart = calculateWithSingularityAtLeft(
                functionId, singularPoint, b, eps / 2, method);

        log.info("Левая часть: {}, правая часть: {}, сумма: {}",
                leftPart, rightPart, leftPart + rightPart);

        return leftPart + rightPart;
    }

    private IntegrationResponse calculateProperIntegral(IntegrationRequest request) {
        Function<Double, Double> f = functionProvider.getFunction(request.getFunctionId());
        IntegrationMethod method = selectMethod(request.getMethodId());

        double a = request.getA();
        double b = request.getB();
        double eps = request.getEpsilon();

        int n = 4;
        int k = method.getOrder();
        double ih, i2h, diff, error = 0;

        try {
            do {
                ih = method.calculate(f, a, b, n);
                n *= 2;
                i2h = method.calculate(f, a, b, n);

                diff = Math.abs(i2h - ih);
                error = diff / (Math.pow(2, k) - 1);

                if (n > 10_000_000) {
                    return IntegrationResponse.builder()
                            .status("error")
                            .message("Требуемая точность не достигнута при n = " + n)
                            .build();
                }
            } while (diff > eps);

            Double exactValue = functionProvider.calculateExactValue(request.getFunctionId(), a, b);


            return IntegrationResponse.builder()
                    .result(i2h)
                    .n(n)
                    .error(error)
                    .exactValue(exactValue)
                    .isImproper(false)
                    .functionType("continuous")
                    .singularityType("Нет особых точек")
                    .status("success")
                    .message("Вычисления успешно завершены")
                    .build();

        } catch (Exception e) {
            log.error("Ошибка при вычислении: {}", e.getMessage());
            return IntegrationResponse.builder()
                    .status("error")
                    .message("Ошибка при вычислении: " + e.getMessage())
                    .build();
        }
    }

    private double estimateError(double numerical, Double exact) {
        if (exact == null || Double.isNaN(exact) || Double.isInfinite(exact)) {
            return Double.NaN;
        }
        return Math.abs(numerical - exact);
    }

    private IntegrationMethod selectMethod(int methodId) {
        return switch (methodId) {
            case 1 -> new RectangleMethod(RectangleMethod.Type.LEFT);
            case 2 -> new RectangleMethod(RectangleMethod.Type.RIGHT);
            case 3 -> new RectangleMethod(RectangleMethod.Type.MIDDLE);
            case 4 -> new TrapezoidMethod();
            case 5 -> new SimpsonMethod();
            default -> throw new IllegalArgumentException("Неверный ID метода");
        };
    }
}