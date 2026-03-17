package yaart.s468198.service.methods;

import java.util.function.Function;

public interface IntegrationMethod {
    double calculate(Function<Double, Double> f, double a, double b, int n);
    int getOrder();
}