package yaart.s468198.util;

import yaart.s468198.model.response.PointDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class MathUtils {


    public static List<PointDTO> generateGraphPoints(Function<Double, Double> f, double a, double b, int count) {
        int safeCount = Math.min(Math.max(count, 10), 1000);

        List<PointDTO> points = new ArrayList<>();

        if (a >= b) return points;

        double margin = (b - a) * 0.1;
        double start = a - margin;
        double end = b + margin;
        double step = (end - start) / safeCount;

        for (int i = 0; i <= safeCount; i++) {
            double x = start + i * step;
            try {
                Double y = f.apply(x);
                if (y != null && !Double.isNaN(y) && !Double.isInfinite(y)) {
                    points.add(new PointDTO(x, y));
                }
            } catch (Exception e) {
            }
        }
        return points;
    }
}

