
#import "CDCoverView.h"


@implementation CDCoverView

- (void)drawRect:(CGRect)rect{

    CGFloat rootViewHeight = CGRectGetHeight(rect);
    CGFloat rootViewWidth  = CGRectGetWidth(rect);
    CGFloat minAxis = MIN(rootViewHeight, rootViewWidth);
    CGRect holeRect = CGRectMake((CGFloat) (0.5 * (rootViewWidth  - minAxis)) + 0.12*rootViewWidth,
                                 (CGFloat)(0.5 * (rootViewHeight - minAxis)) + 0.12*rootViewWidth,
                                 minAxis - 0.12*rootViewWidth * 2,
                                 minAxis - 0.12*rootViewWidth * 2);

    [[UIColor colorWithWhite:0.0f alpha:0.5f] setFill];//阴影效果 根据透明度来设计
    UIRectFill( rect );
    CGRect holeRectIntersection = CGRectIntersection( holeRect, rect );
    [[UIColor clearColor] setFill];
    UIRectFill( holeRectIntersection );
}

@end
