package yaart.s468198.service.methods;

import java.util.function.Function;

public class TrapezoidMethod implements IntegrationMethod {
    @Override
    public double calculate(Function<Double, Double> f, double a, double b, int n) {
        double h = (b - a) / n;
        double sum = (f.apply(a) + f.apply(b)) / 2.0;

        for (int i = 1; i < n; i++) {
            sum += f.apply(a + i * h);
        }
        return sum * h;
    }

    @Override
    public int getOrder() {
        return 2;
    }
}