package yaart.s468198.service.methods;

import java.util.Random;
import java.util.function.Function;

public class MonteCarloMethod implements IntegrationMethod {
    private final Random random = new Random();

    @Override
    public double calculate(Function<Double, Double> f, double a, double b, int n) {
        double minUnfiltered = Double.MAX_VALUE;
        double maxUnfiltered = -Double.MAX_VALUE;

        for (int i = 0; i <= 1000; i++) {
            double y = f.apply(a + (b - a) * i / 1000.0);
            if (!Double.isInfinite(y) && !Double.isNaN(y)) {
                minUnfiltered = Math.min(minUnfiltered, y);
                maxUnfiltered = Math.max(maxUnfiltered, y);
            }
        }

        double minY = Math.min(0, minUnfiltered) - 0.5;
        double maxY = Math.max(0, maxUnfiltered) + 1.0;

        int hits = 0;
        for (int i = 0; i < n; i++) {
            double x = a + (b - a) * random.nextDouble();
            double y = minY + (maxY - minY) * random.nextDouble();

            double targetY = f.apply(x);

            if (targetY >= 0) {
                if (y > 0 && y <= targetY) hits++;
            } else {
                if (y < 0 && y >= targetY) hits--;
            }
        }

        return (b - a) * (maxY - minY) * hits / n;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}